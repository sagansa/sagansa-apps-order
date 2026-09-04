<?php

use App\Models\SalesOrder;

test('image_delivery_urls decode json array hasil multi-upload', function () {
    $order = (new SalesOrder)->forceFill([
        'image_delivery' => '["images/Delivery/a.jpg","images/Delivery/b.jpg"]',
    ]);

    $urls = $order->image_delivery_urls;

    expect($urls)->toHaveCount(2)
        ->and($urls[0])->toContain('/storage/images/Delivery/a.jpg')
        ->and($urls[1])->toContain('/storage/images/Delivery/b.jpg')
        // URL rusak lama memuat raw JSON: .../storage/["images/..."]
        ->and($urls[0])->not->toContain('[');
});

test('image_delivery_urls menangani path tunggal legacy', function () {
    $order = (new SalesOrder)->forceFill([
        'image_delivery' => 'images/Delivery/old.jpg',
    ]);

    expect($order->image_delivery_urls)->toHaveCount(1)
        ->and($order->image_delivery_urls[0])->toContain('/storage/images/Delivery/old.jpg');
});

test('image_delivery_urls mengabaikan entri kosong di array', function () {
    $order = (new SalesOrder)->forceFill([
        'image_delivery' => '["images/Delivery/a.jpg","","images/Delivery/c.jpg"]',
    ]);

    expect($order->image_delivery_urls)->toHaveCount(2);
});

test('image_delivery_urls kosong bila kolom null', function () {
    $order = new SalesOrder;

    expect($order->image_delivery_urls)->toBe([])
        ->and($order->image_delivery)->toBeNull();
});

test('accessor image_delivery mengembalikan url pertama saja', function () {
    $order = (new SalesOrder)->forceFill([
        'image_delivery' => '["images/Delivery/a.jpg","images/Delivery/b.jpg"]',
    ]);

    expect($order->image_delivery)->toContain('/storage/images/Delivery/a.jpg')
        ->and($order->image_delivery)->not->toContain('b.jpg');
});
