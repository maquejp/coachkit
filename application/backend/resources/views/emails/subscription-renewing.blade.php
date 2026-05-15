@extends('emails.layout')

@section('content')
<h2>Hi {{ $userName }},</h2>
<p>Your subscription is set to renew soon.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr><td style="padding:8px 0;font-weight:600">Plan:</td><td style="padding:8px 0">{{ $planName }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Renewal Date:</td><td style="padding:8px 0">{{ $renewalDate }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Amount:</td><td style="padding:8px 0">{{ $amount }}</td></tr>
</table>
<p>No action is needed — the renewal will be processed automatically.</p>
<p>If you'd like to cancel or make changes, please do so before the renewal date.</p>
<p style="margin-top:16px">
<a href="{{ url('/billing') }}" class="btn">Manage Subscription</a>
</p>
@endsection
