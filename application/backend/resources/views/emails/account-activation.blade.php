@extends('emails.layout')

@section('content')
<h2>Hi {{ $userName }},</h2>
<p>Welcome to {{ config('app.name') }}! Please activate your account to get started.</p>
<p>Click the button below to activate your account:</p>
<p style="margin-top:16px">
<a href="{{ $activationUrl }}" class="btn">Activate Account</a>
</p>
<p>If you did not create an account, you can safely ignore this email.</p>
<hr style="border:none;border-top:1px solid #f3f4f6;margin:16px 0">
<p style="font-size:12px;color:#6b7280">Account email: {{ $email }}</p>
@endsection
