@extends('emails.layout')

@section('content')
<h2>Hi {{ $userName }},</h2>
<p>Great news! A spot has opened up in <strong>{{ $className }}</strong>.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr><td style="padding:8px 0;font-weight:600">Class:</td><td style="padding:8px 0">{{ $className }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Date:</td><td style="padding:8px 0">{{ $date }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Time:</td><td style="padding:8px 0">{{ $time }}</td></tr>
</table>
<p>You have <strong>{{ $claimExpiryHours }} hours</strong> to claim this spot before it's offered to someone else.</p>
<p style="margin-top:16px">
<a href="{{ url('/bookings') }}" class="btn">Claim Your Spot</a>
</p>
@endsection
