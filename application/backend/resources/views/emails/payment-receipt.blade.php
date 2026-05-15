@extends('emails.layout')

@section('content')
<h2>Hi {{ $userName }},</h2>
<p>Your payment has been processed successfully.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr><td style="padding:8px 0;font-weight:600">Description:</td><td style="padding:8px 0">{{ $description }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Amount:</td><td style="padding:8px 0">{{ $currency }} {{ number_format($amount, 2) }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Date:</td><td style="padding:8px 0">{{ $date }}</td></tr>
</table>
<p style="margin-top:16px">
<a href="{{ $receiptUrl }}" class="btn">View Receipt</a>
</p>
<p>Thank you for your business!</p>
@endsection
