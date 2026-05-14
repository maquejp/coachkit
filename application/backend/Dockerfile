FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    postgresql-dev \
    $PHPIZE_DEPS \
  && docker-php-ext-install pdo_pgsql \
  && apk del $PHPIZE_DEPS

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
