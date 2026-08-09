<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Upload file gambar ke image service (img.sagansa.id).
 *
 * Image service akan menangani konversi ke WebP (quality 80) + penamaan UUID,
 * sehingga client cukup mengirim file asli apa adanya. Relative path yang
 * dikembalikan service ini disimpan ke DB; URL-nya dibangun oleh PublicStorageUrl.
 *
 * Sebelumnya upload payment disimpan ke disk lokal apps/order, sehingga URL
 * img.sagansa.id/storage/... yang dibangun resolver selalu 404. Service ini
 * memastikan file benar-benar dikirim ke image service (TIDAK fallback ke disk
 * lokal — fallback lokal justru sumber bug).
 */
class ImgServiceUploader
{
    /**
     * Upload gambar ke image service.
     *
     * @param  UploadedFile  $file       File gambar yang sudah divalidasi (image/*).
     * @param  string        $directory  Direktori tujuan relatif, mis. "images/Order/Payment".
     * @return string|null               Relative path (mis. "images/Order/Payment/<uuid>.webp"),
     *                                   atau null bila gagal.
     */
    public function upload(UploadedFile $file, string $directory): ?string
    {
        $token = config('services.image.api_token');
        $serviceUrl = rtrim((string) config('services.image.service_url', 'https://img.sagansa.id'), '/');

        if (! $token) {
            Log::error('ImgServiceUploader: IMAGE_SERVICE_TOKEN belum dikonfigurasi. Upload dibatalkan.', [
                'directory' => $directory,
                'original_name' => $file->getClientOriginalName(),
            ]);
            return null;
        }

        $uploadUrl = $serviceUrl . '/api/upload';

        try {
            $response = Http::withToken($token)
                ->timeout(30)
                ->acceptJson()
                ->attach('image', $file->get(), $file->getClientOriginalName())
                ->post($uploadUrl, ['directory' => $directory]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['path']) && is_string($data['path'])) {
                    return $data['path'];
                }
                Log::error('ImgServiceUploader: response sukses tanpa field path.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            Log::error('ImgServiceUploader: upload ke img service gagal.', [
                'status' => $response->status(),
                'body' => $response->body(),
                'directory' => $directory,
            ]);
        } catch (\Throwable $e) {
            Log::error('ImgServiceUploader: exception saat upload ke img service.', [
                'message' => $e->getMessage(),
                'directory' => $directory,
            ]);
        }

        return null;
    }
}
