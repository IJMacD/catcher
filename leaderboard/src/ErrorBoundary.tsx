import React, { Component } from "react";

type ErrorBoundaryProps = {
    children: React.ReactNode;
};

type ErrorBoundaryState = {
    error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = {
            error: null,
        };
    }

    componentDidCatch(error: Error) {
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