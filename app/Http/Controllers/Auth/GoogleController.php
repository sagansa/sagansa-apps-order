<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use Inertia\Inertia;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
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

            // Jika nomor telepon belum ada, minta lengkapi profil
            if (!$user->phone_number) {
                return redirect()->route('complete-profile');
            }

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
            'phone_number' => ['required', 'string', 'max:20', 'regex:/^([0-9\s\-\+\(\)]*)$/'],
        ]);

        $user = Auth::user();
        $user->update([
            'phone_number' => $request->phone_number,
        ]);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
