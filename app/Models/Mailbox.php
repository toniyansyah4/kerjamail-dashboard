<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mailbox extends Model
{
    use HasFactory;

    protected $fillable = [
        'domain_id',
        'local_part',
        'email',
        'password',
        'quota', // dalam MB
        'aliases', // array atau json
    ];

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }

    public function getEmailAttribute()
    {
        return "{$this->local_part}@{$this->domain->name}";
    }
    
    protected $casts = [
        'aliases' => 'array',
    ];
}
