<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'midtrans' => [
        'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
        'server_key' => env('MIDTRANS_SERVER_KEY'),
        'client_key' => env('MIDTRANS_CLIENT_KEY'),
        'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
        'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),
        'is_3ds' => env('MIDTRANS_IS_3DS', true),
        'fees' => [
            'bca_va' => ['type' => 'fixed', 'value' => 4440, 'label' => 'BCA Virtual Account'],
            'mandiri_va' => ['type' => 'fixed', 'value' => 4440, 'label' => 'Mandiri Virtual Account'],
            'bni_va' => ['type' => 'fixed', 'value' => 4440, 'label' => 'BNI Virtual Account'],
            'bri_va' => ['type' => 'fixed', 'value' => 4440, 'label' => 'BRI Virtual Account'],
            'permata_va' => ['type' => 'fixed', 'value' => 4440, 'label' => 'Permata Virtual Account'],
            'other_va' => ['type' => 'fixed', 'value' => 4440, 'label' => 'Bank Transfer (VA Lainnya)'],
            'qris'  => ['type' => 'percentage', 'value' => 0.007, 'label' => 'QRIS'],
            'gopay' => ['type' => 'percentage', 'value' => 0.02, 'label' => 'GoPay'],
            'shopeepay' => ['type' => 'percentage', 'value' => 0.02, 'label' => 'ShopeePay'],
            'credit_card' => ['type' => 'mix', 'percent' => 0.029, 'fixed' => 2220, 'label' => 'Kartu Kredit'],
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],

    // Image service (img.sagansa.id). Token Sanctum di-share dengan service
    // lain (api-ops) karena seluruh service membaca tabel personal_access_tokens
    // yang sama. service_url dipakai juga oleh PublicStorageUrl untuk resolve URL.
    'image' => [
        'api_token' => env('IMAGE_SERVICE_TOKEN'),
        'service_url' => env('IMG_SERVICE_URL', 'https://img.sagansa.id'),
    ],

];
