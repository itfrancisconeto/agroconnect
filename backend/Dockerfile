FROM ruby:3.2.2-slim

# System dependencies required by Rails, PostgreSQL and native gems.
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      postgresql-client \
      git \
      curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Ruby dependencies first to improve Docker layer cache reuse.
COPY Gemfile ./
RUN bundle install

# Copy the Rails application files.
COPY . .

# Ensure scripts are executable inside the image.
RUN chmod +x bin/dev bin/rails bin/rake

EXPOSE 3000

CMD ["bash", "./bin/dev"]
