import React from "react";
import { Component } from "react";

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
        };
    }

    /**
     * @param {Error} error
     */
    componentDidCatch(error) {
        this.setState({ error });
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{ background: "white", display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <h1 style={{ color: "red" }}>Whoops! Something went wrong.</h1>
                    <p>Please refresh the page to play again.</p>
                </div>
            );
        }

        return this.props.children;
    }
}