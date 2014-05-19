class ClubsController < ApplicationController
  before_action :set_club, only: [:show, :edit, :update, :destroy,:register]

  # GET /clubs
  def index
    @clubs = Club.all
  end

  # GET /clubs/1
  def show
  end

  # GET /clubs/new
  def new
    @club = Club.new
  end

  # GET /clubs/1/edit
  def edit
  end

  def register

    @register=Register.new
    @register.emp_id=Employee.where(emp_badge: current_user.badge).first.emp_id
    @register.club_id=@club.club_id
    @register.update_time=Time.now
    @register.operater=current_user.badge
    if @register.save
      redirect_to @club, notice: 'You join the club successfully.'
    else
      render text: 'something is wrong'
    end

  end
  # POST /clubs
  def create
    @club = Club.new(club_params)

    if @club.save
      redirect_to @club, notice: 'Club was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /clubs/1
  def update
    if @club.update(club_params)
      redirect_to @club, notice: 'Club was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /clubs/1
  def destroy
    @club.destroy
    redirect_to clubs_url, notice: 'Club was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_club
      @club = Club.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def club_params
      params.require(:club).permit(:club_id, :club_name, :status, :descriptions, :language_type, :operator, :create_time, :update_time)
    end
end
