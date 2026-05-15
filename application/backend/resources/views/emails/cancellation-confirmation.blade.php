@extends('emails.layout')

@section('content')
<h2>Hi {{ $userName }},</h2>
<p>Your booking has been cancelled as requested.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr><td style="padding:8px 0;font-weight:600">Class:</td><td style="padding:8px 0">{{ $className }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Date:</td><td style="padding:8px 0">{{ $date }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Time:</td><td style="padding:8px 0">{{ $time }}</td></tr>
</table>
<p>If this was a mistake, please rebook while spots are still available.</p>
@endsection
