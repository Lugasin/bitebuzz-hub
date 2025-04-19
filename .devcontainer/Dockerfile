# Use an official base image
FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-20.04

# Install your libraries (example: Node.js dependencies)
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Optionally install Node.js (adjust version if needed)
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# Set the default shell to bash
ENV SHELL /bin/bash
