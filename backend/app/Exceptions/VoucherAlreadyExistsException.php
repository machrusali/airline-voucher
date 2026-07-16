<?php

namespace App\Exceptions;

use Exception;

class VoucherAlreadyExistsException extends Exception
{
    public function __construct()
    {
        parent::__construct(
            'Vouchers have already been generated for this flight and date.',
            409
        );
    }
}