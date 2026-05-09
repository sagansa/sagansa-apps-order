<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Force HTTPS when using ngrok or production
        if (config('app.env') !== 'local' || request()->header('x-forwarded-proto') === 'https') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
        
        // Trust ngrok proxy for CSRF token
        if (request()->header('x-forwarded-proto') === 'https') {
            request()->server->set('HTTPS', 'on');
        }
    }
}
