Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"

      resources :customers, only: %i[index create destroy]
      resources :product_areas, only: %i[index]
      resources :request_tickets, only: %i[index create update destroy] do
        member do
          patch :advance_status
        end

        resources :ticket_comments, only: %i[create]
      end
    end
  end
end
