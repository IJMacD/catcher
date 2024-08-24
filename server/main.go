/*
 * Catcher Leaderboard API 1.0
 *
 * This is the documentation for the API of the catcher webapp used for interacting with the leaderboard.  Some useful links: - [The Catcher repository](https://github.com/IJMacD/catcher) - [A live demo of the game](https://catcher.ijmacd.com) - [A static version of the game](https://ijmacd.github.io/catcher) (No leaderboard)
 *
 * API version: 1.0
 * Contact: IJMacD@gmail.com
 * Generated by: Swagger Codegen (https://github.com/swagger-api/swagger-codegen.git)
 */
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	c "github.com/IJMacD/catcher-ts-go/go"
)

type logWriter struct {
}

func (writer logWriter) Write(bytes []byte) (int, error) {
	return fmt.Print(time.Now().UTC().Format("2006-01-02T15:04:05.999Z") + " " + string(bytes))
}

func main() {
	log.SetFlags(0)
	log.SetOutput(new(logWriter))

	log.Printf("Server started")

	router := c.NewRouter()

	hub := c.GetHub()
	go hub.Run()

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))

	log.Fatal(http.ListenAndServe(":8080", router))
}
