<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bank extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function transferToAccounts()
    {
        return $this->hasMany(TransferToAccount::class);
    }
}
