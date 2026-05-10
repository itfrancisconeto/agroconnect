# frozen_string_literal: true

# Prevent sensitive parameters from being exposed in application logs.
#
# Rails will replace these values with [FILTERED] whenever they appear
# in request parameters, Active Record logs or other parameter logging contexts.
Rails.application.config.filter_parameters += [
  :password,
  :password_confirmation,
  :token,
  :access_token,
  :refresh_token,
  :authorization,
  :api_key,
  :secret,
  :document
]