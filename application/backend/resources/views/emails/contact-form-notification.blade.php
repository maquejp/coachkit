@extends('emails.layout')

@section('content')
<h2>New Contact Form Submission</h2>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
<tr><td style="padding:8px 0;font-weight:600">Name:</td><td style="padding:8px 0">{{ $name }}</td></tr>
<tr><td style="padding:8px 0;font-weight:600">Email:</td><td style="padding:8px 0">{{ $email }}</td></tr>
@if($phone)
<tr><td style="padding:8px 0;font-weight:600">Phone:</td><td style="padding:8px 0">{{ $phone }}</td></tr>
@endif
</table>
<h3>Message</h3>
<p>{{ $body }}</p>
@endsection
