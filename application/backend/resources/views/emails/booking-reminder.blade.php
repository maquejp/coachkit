@extends('emails.layout')

@section('content')
<h2>Hi {{ $userName }},</h2>
<p>This is a friendly reminder that your class is tomorrow!</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr><td style="padding:8px 0;font-weight:600">Class:</td><td style="padding:8px 0">{{ $className }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Date:</td><td style="padding:8px 0">{{ $date }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Time:</td><td style="padding:8px 0">{{ $time }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Location:</td><td style="padding:8px 0">{{ $location }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Instructor:</td><td style="padding:8px 0">{{ $instructor }}</td></tr>
</table>
<p>Don't forget to bring your gear and water!</p>
@endsection
