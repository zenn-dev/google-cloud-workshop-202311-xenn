FROM ruby:3.2-slim
ARG APP_ROOT=/zenn-app

ENV TZ Asia/Tokyo
ENV RAILS_SERVE_STATIC_FILES true
RUN mkdir $APP_ROOT
WORKDIR $APP_ROOT

RUN apt update -qq && apt install -y postgresql-client
RUN apt install -y git tzdata vim
RUN apt install -y build-essential libpq-dev # slimで追加が必要なパッケージ
RUN gem install bundler
RUN rm -rf /var/cache/apt/*

COPY Gemfile $APP_ROOT/Gemfile
COPY Gemfile.lock $APP_ROOT/Gemfile.lock
RUN bundle config set --local deployment 'true'
RUN bundle config set --local without 'development test linter'
RUN bundle install
COPY . $APP_ROOT

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

CMD ["entrypoint.sh"]
