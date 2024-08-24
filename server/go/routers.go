package catcher

import (
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
		var handler http.Handler
		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}

	return router
}

func basicAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract the username and password from the request
		// Authorization header. If no Authentication header is present
		// or the header value is invalid, then the 'ok' return value
		// will be false.
		username, password, ok := r.BasicAuth()
		if ok {
			usernameMatch := username == "moderator"
			passwordMatch := password == os.Getenv("MODERATOR_PASSWORD")

			// If the username and password are correct, then call
			// the next handler in the chain. Make sure to return
			// afterwards, so that none of the code below is run.
			if usernameMatch && passwordMatch {
				next.ServeHTTP(w, r)
				return
			}
		}

		// If the Authentication header is not present, is invalid, or the
		// username or password is wrong, then set a WWW-Authenticate
		// header to inform the client that we expect them to use basic
		// authentication and send a 401 Unauthorized response.
		w.Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	})
}

var routes = Routes{
	Route{
		"AddEntry",
		strings.ToUpper("Post"),
		"/api/leaderboard",
		AddEntry,
	},

	Route{
		"DeleteEntry",
		strings.ToUpper("Delete"),
		"/api/leaderboard/{entryId}",
		basicAuth(DeleteEntry),
	},

	Route{
		"GetEntries",
		strings.ToUpper("Get"),
		"/api/leaderboard",
		GetEntriesWS,
	},

	Route{
		"GetEntryById",
		strings.ToUpper("Get"),
		"/api/leaderboard/{entryId}",
		GetEntryById,
	},

	Route{
		"VerifyModeration",
		strings.ToUpper("Get"),
		"/api/moderation/verify",
		basicAuth(VerifyModeration),
	},
}
