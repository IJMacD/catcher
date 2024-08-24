package catcher

import (
	"slices"
	"sync"
	"time"
)

type state struct {
	sync.RWMutex
	leaderboard []LeaderboardEntry
	nextId      int64
}

func AddToLeaderboard(entry LeaderboardEntry) {
	s.add(entry)
}

func RemoveFromLeaderboard(entryId int64) {
	idx := slices.IndexFunc(s.get(), func(e LeaderboardEntry) bool { return e.Id == entryId })

	if idx < 0 {
		return
	}

	s.delete(idx)
}

func GetLeaderboard() []LeaderboardEntry {
	return s.get()
}

func CreateEntry(name string, score int64) LeaderboardEntry {
	s.Lock()
	s.nextId++
	id := s.nextId
	s.Unlock()
	return LeaderboardEntry{id, name, score, time.Now()}
}

func (s *state) add(e LeaderboardEntry) {
	s.Lock()
	s.leaderboard = append(s.leaderboard, e)
	slices.SortFunc(s.leaderboard, func(a LeaderboardEntry, b LeaderboardEntry) int {
		return int(b.Score - a.Score)
	})
	s.Unlock()
}

func (s *state) get() []LeaderboardEntry {
	s.RLock()
	defer s.RUnlock()
	return s.leaderboard
}

func (s *state) delete(idx int) {
	s.Lock()
	s.leaderboard = append(s.leaderboard[:idx], s.leaderboard[idx+1:]...)
	s.Unlock()
}

var s = &state{leaderboard: make([]LeaderboardEntry, 0), nextId: 0}
