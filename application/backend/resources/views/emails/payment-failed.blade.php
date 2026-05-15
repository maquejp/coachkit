@extends('emails.layout')

@section('content')
<h2>Hi {{ $userName }},</h2>
<p>Unfortunately, your payment could not be processed.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr><td style="padding:8px 0;font-weight:600">Description:</td><td style="padding:8px 0">{{ $description }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Amount:</td><td style="padding:8px 0">{{ $currency }} {{ number_format($amount, 2) }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Error:</td><td style="padding:8px 0">{{ $errorMessage }}</td></tr>
</table>
<p>Please update your payment method to avoid any interruption to your services.</p>
<p style="margin-top:16px">
<a href="{{ url('/billing') }}" class="btn">Update Payment Method</a>
</p>
@endsection
