@extends('emails.layout')

@section('content')
<h2>Hi {{ $userName }},</h2>
<p>Thank you for subscribing! Your plan is now active.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr><td style="padding:8px 0;font-weight:600">Plan:</td><td style="padding:8px 0">{{ $planName }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Start Date:</td><td style="padding:8px 0">{{ $startDate }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">End Date:</td><td style="padding:8px 0">{{ $endDate }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Amount:</td><td style="padding:8px 0">{{ $amount }}</td></tr>
</table>
<p>You now have full access to all features included in your plan.</p>
@endsection
