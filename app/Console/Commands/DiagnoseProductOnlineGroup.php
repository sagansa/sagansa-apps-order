<?php

namespace App\Console\Commands;

use App\Models\ProductOnlineGroup;
use Illuminate\Console\Command;

class DiagnoseProductOnlineGroup extends Command
{
    /**
     * Cek setiap product online group apakah lolos filter home catalog:
     *   is_active=true AND online_category_id != 4 AND (online_price > 0 OR has priceTiers)
     * Grup yang gagal filter tidak akan muncul di home order app.
     *
     * Jalankan: php artisan sagansa:diagnose-groups
     */
    protected $signature = 'sagansa:diagnose-groups';

    protected $description = 'Diagnosa product online group yang hilang dari home catalog (gagal lolos filter)';

    public function handle(): int
    {
        $groups = ProductOnlineGroup::with(['onlineCategory', 'priceTiers'])->get();

        if ($groups->isEmpty()) {
            $this->warn('Tidak ada product online group di database.');
            return Command::SUCCESS;
        }

        $this->info('Total product online group: ' . $groups->count());
        $this->newLine();

        $hidden = 0;

        foreach ($groups as $g) {
            $reasons = [];
            if (! $g->is_active) {
                $reasons[] = 'is_active=false';
            }
            if ($g->online_category_id == 4) {
                $reasons[] = 'kategori=4 (di-exclude)';
            }
            if (! $g->onlineCategory) {
                $reasons[] = 'onlineCategory=NULL';
            }
            if ($g->online_price <= 0 && $g->priceTiers->isEmpty()) {
                $reasons[] = 'TANPA HARGA (online_price=0 & tidak ada priceTiers)';
            }

            if (empty($reasons)) {
                $this->line("  <fg=green>✓ MUNCUL</> id={$g->id} | {$g->name}");
            } else {
                $hidden++;
                $this->line("  <fg=red>✗ HILANG</> id={$g->id} | {$g->name}");
                $this->line("     active=" . ($g->is_active ? 'true' : 'false')
                    . "  cat_id={$g->online_category_id}"
                    . "  cat_name=" . ($g->onlineCategory?->name ?? 'NULL'));
                $this->line("     online_price={$g->online_price}  priceTiers_count=" . $g->priceTiers->count());
                $this->line("     <fg=yellow>Alasan: " . implode('; ', $reasons) . "</>");
            }
            $this->newLine();
        }

        $this->newLine();
        if ($hidden > 0) {
            $this->warn("{$hidden} grup HILANG dari home catalog.");
        } else {
            $this->info('Semua grup muncul di home catalog.');
        }

        return Command::SUCCESS;
    }
}
