<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domain extends Model
{
    protected $fillable = [
        'user_id',
        'domain',
        'verification_token',
        'verified_at',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
