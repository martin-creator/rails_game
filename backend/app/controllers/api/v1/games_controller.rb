class Api::V1::GamesController < ApplicationController
    def index
       top_scores = Game.top_five
         render json: top_scores, only: [:score], include: {player: {only: [:id, :username]}}
    end

    def create
        begin
            # Find player with username passed in params
            player = Player.find_by(username: params[:username].upcase)
            new_score = params[:score]

            # Find the game with that player
            game = Game.find_by(player_id: player.id)

            # If the game exists, update the score if the new score is higher
            if game
                if game.score < new_score
                    game.score = new_score
                    game.save
                end
            else 
                # Create a new game
                Game.create(player_id: player.id, score: new_score)
            end

            top_scores = Game.top_five
            render json: top_scores, only: [:score], include: {player: {only: [:id, :username]}}
            
        rescue => exception
            render json: {message: "Cannot save the game"}, status: 400
        end
    end

end