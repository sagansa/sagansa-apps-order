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
        'fees' => [
            'default' => ['percentage' => 0.02, 'fixed' => 0], // 2% + 0 fixed
            'gopay' => ['percentage' => 0.02, 'fixed' => 0], // 1.5%
            'dana' => ['percentage' => 0.015, 'fixed' => 0], // 1.5%
            'qris'  => ['percentage' => 0.007, 'fixed' => 0], // 1.5%
            'shopeepay' => ['percentage' => 0.02, 'fixed' => 0], // 1.5%
            'bank_transfer' => ['percentage' => 0, 'fixed' => 4000], // Example: Rp 4,000 fixed fee
            'credit_card' => ['percentage' => 0.029, 'fixed' => 2000], // 2.9% + Rp 2,500 fixed
        ],
    ],

];
