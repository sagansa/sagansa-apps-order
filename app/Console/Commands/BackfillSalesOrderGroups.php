<?php

namespace App\Console\Commands;

use App\Models\DetailSalesOrder;
use App\Models\ProductOnlineGroupItem;
use Illuminate\Console\Command;

class BackfillSalesOrderGroups extends Command
{
    protected $signature = 'sagansa:backfill-order-groups
        {--dry-run : Only show how many records would be updated}';

    protected $description = 'Backfill product_online_group_id on existing detail_sales_orders whose product_id now belongs to an online group';

    public function handle(): int
    {
        $grouped = ProductOnlineGroupItem::pluck('product_online_group_id', 'product_id');

        if ($grouped->isEmpty()) {
            $this->warn('Tidak ada mapping product→group ditemukan.');
            return Command::SUCCESS;
        }

        // Kelompokkan per group_id untuk update batch
        $byGroup = [];
        foreach ($grouped as $productId => $groupId) {
            $byGroup[(int) $groupId][] = (int) $productId;
        }

        $totalAffected = 0;

        foreach ($byGroup as $groupId => $productIds) {
            $query = DetailSalesOrder::whereNull('product_online_group_id')
                ->whereIn('product_id', $productIds);

            $count = $query->count();

            if ($count === 0) {
                continue;
            }

            if ($this->option('dry-run')) {
                $this->line("  Group #{$groupId}: {$count} record(s) would be updated.");
            } else {
                $query->update(['product_online_group_id' => $groupId]);
                $this->line("  Group #{$groupId}: {$count} record(s) updated.");
            }

            $totalAffected += $count;
        }

        if ($this->option('dry-run')) {
            $this->info("Dry-run: {$totalAffected} record(s) will be updated when run without --dry-run.");
        } else {
            $this->info("Selesai. {$totalAffected} detail_sales_orders updated.");
        }

        return Command::SUCCESS;
    }
}
