package catcher

import (
	"encoding/json"
	"net/http"
	"slices"
	"strconv"

	"github.com/gorilla/mux"
)

var hub = NewHub()

func GetHub() *Hub {
	return hub
}

func AddEntry(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		// if there was an error here, we return the error
		// as response along with a 400 http response code
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	name := r.FormValue("name")
	s := r.FormValue("score")

	score, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		panic(err)
	}

	entry := CreateEntry(name, score)

	AddToLeaderboard(entry)

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(entry)

	bytes, err := json.Marshal(GetLeaderboard())
	if err != nil {
		panic(err)
	}

	hub.broadcast <- bytes
}

func DeleteEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)

	entryId, err := strconv.ParseInt(vars["entryId"], 10, 64)
	if err != nil {
		panic(err)
	}

	RemoveFromLeaderboard(entryId)

	bytes, err := json.Marshal(GetLeaderboard())
	if err != nil {
		panic(err)
	}

	hub.broadcast <- bytes
}

func GetEntriesWS(w http.ResponseWriter, r *http.Request) {
	upgrade := false
	for _, header := range r.Header["Upgrade"] {
		if header == "websocket" {
			upgrade = true
			break
		}
	}

	if upgrade {
		ServeWs(hub, w, r)
		return
	}

	GetEntries(w, r)
}

func GetEntries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(GetLeaderboard())
}

func GetEntryById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	entryId, err := strconv.ParseInt(vars["entryId"], 10, 64)
	if err != nil {
		panic(err)
	}

	leaderboard := GetLeaderboard()

	idx := slices.IndexFunc(leaderboard, func(c LeaderboardEntry) bool { return c.Id == entryId })

	if idx < 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(leaderboard[idx])
}
