<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaitlistEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WaitlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = WaitlistEntry::query();
        if ($scheduleId = $request->query('scheduleId')) {
            $query->where('schedule_id', $scheduleId);
        }
        $entries = $query->get();

        return response()->json([
            'success' => true,
            'data' => $entries->map(fn ($e) => $this->formatItem($e)),
        ]);
    }

    public function join(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'scheduleId' => 'required|integer|exists:weekly_schedule,id',
            'date' => 'required|date',
        ]);

        $position = WaitlistEntry::where('schedule_id', $validated['scheduleId'])
            ->where('date', $validated['date'])
            ->count() + 1;

        $entry = WaitlistEntry::create([
            'user_id' => $validated['userId'],
            'schedule_id' => $validated['scheduleId'],
            'date' => $validated['date'],
            'status' => 'waiting',
        ]);

        $item = $this->formatItem($entry);
        $item['position'] = $position;

        return response()->json(['success' => true, 'data' => $item], 201);
    }

    public function leave(int $id): JsonResponse
    {
        $entry = WaitlistEntry::find($id);
        if (!$entry) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }
        $entry->delete();

        return response()->json(['success' => true, 'data' => null]);
    }

    public function promote(int $id): JsonResponse
    {
        $entry = WaitlistEntry::find($id);
        if (!$entry) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }
        $entry->update(['status' => 'promoted']);
        $entry->refresh();

        return response()->json(['success' => true, 'data' => $this->formatItem($entry)]);
    }

    private function formatItem(WaitlistEntry $entry): array
    {
        return collect($entry->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
