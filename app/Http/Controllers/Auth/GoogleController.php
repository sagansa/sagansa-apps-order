<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use Inertia\Inertia;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        if (!config('services.google.client_id') || !config('services.google.client_secret') || !config('services.google.redirect')) {
            Log::error('Google OAuth is not configured.', [
                'has_client_id' => (bool) config('services.google.client_id'),
                'has_client_secret' => (bool) config('services.google.client_secret'),
                'has_redirect' => (bool) config('services.google.redirect'),
            ]);

            return redirect()
                ->route('login')
                ->with('error', 'Login Google belum dikonfigurasi di server.');
        }

        $url = Socialite::driver('google')->redirect()->getTargetUrl();
        \Illuminate\Support\Facades\Log::info('Google Redirect URL:', ['url' => $url]);
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'password' => null,
                ]);
                $user->markEmailAsVerified();
            } else {
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                    ]);
                }
            }

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));

        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'Login Google gagal: ' . $e->getMessage());
        }
    }

    public function completeProfile()
    {
        return Inertia::render('Auth/CompleteProfile');
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'phone_number' => ['nullable', 'string', 'max:20', 'regex:/^([0-9\s\-\+\(\)]*)$/'],
        ]);

        $user = Auth::user();
        $user->update([
            'phone_number' => $request->filled('phone_number') ? $request->phone_number : null,
        ]);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
