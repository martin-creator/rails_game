Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  #API

  namespace :api do
    namespace :v1 do
      resources :games, :players, only:[:index, :create]
    end
  end
end
