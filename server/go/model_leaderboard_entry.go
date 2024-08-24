package catcher
import (
	"time"
)

type LeaderboardEntry struct {

	Id int64 `json:"id"`

	PlayerName string `json:"playerName"`

	Score int64 `json:"score"`

	SubmittedAt time.Time `json:"submittedAt"`
}
