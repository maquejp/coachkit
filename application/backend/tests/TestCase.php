<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (DB::connection()->getDriverName() === 'sqlite') {
            $pdo = DB::connection()->getPdo();
            $pdo->sqliteCreateFunction('to_char', function ($date, $format) {
                $map = [
                    'YYYY-MM' => 'Y-m',
                    'YYYY-MM-DD' => 'Y-m-d',
                    'Day' => 'l',
                ];
                $phpFormat = $map[$format] ?? $format;
                return date($phpFormat, strtotime($date));
            });
        }
    }
}
