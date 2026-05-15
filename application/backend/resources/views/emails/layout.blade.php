<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ config('app.name') }}</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
.header{text-align:center;padding:20px 0;border-bottom:2px solid #f3f4f6}
.header h1{color:#111827;margin:0;font-size:24px}
.content{padding:24px 0}
.footer{padding:20px 0;border-top:1px solid #f3f4f6;font-size:12px;color:#6b7280;text-align:center}
.btn{display:inline-block;padding:12px 24px;background-color:#2563eb;color:#fff !important;text-decoration:none;border-radius:6px;font-weight:600}
.btn:hover{background-color:#1d4ed8}
</style>
</head>
<body>
<div class="header">
<h1>{{ config('app.name') }}</h1>
</div>
<div class="content">
@yield('content')
</div>
<div class="footer">
<p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
</div>
</body>
</html>
