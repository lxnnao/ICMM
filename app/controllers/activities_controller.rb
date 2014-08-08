class ActivitiesController < ApplicationController
  load_and_authorize_resource
  before_action :set_activity, only: [:show, :edit, :update, :destroy,:join,:volunteer]
  #before_filter :authenticate_user!, only: [:new,:create,:edit, :update, :destroy]
  # GET /activities
  def upload_image
      @idtest=params[:id]
    render 'upload'
  end


  def index
    @activities = Activity.includes(:contactor).all
  end

  # GET /activities/1
  def show
  end

  # GET /activities/new
  def new
    @activity = Activity.new
    if contactor = self.get_contactor_from_session
      @activity.contactor = contactor
    else
      @activity.build_contactor
    end
  end

  # GET /activities/1/edit
  def edit
  end

  # POST /activities
  def create
    @activity = Activity.new(activity_params)

    if @activity.contactor.save
       @activity.contact_id=@activity.contactor.emp_id
       if @activity.save
          redirect_to @activity, notice: 'Activity was successfully created.'
          #render text: @activity.contactor.inspect
       else
          render action: 'new'
       end
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /activities/1
  def update
    @activity.update_time=Time.now
    if @activity.update(activity_params)
      redirect_to @activity, notice: 'Activity was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /activities/1
  def destroy
    @activity.destroy
    redirect_to activities_url, notice: 'Activity was successfully destroyed.'
  end
  # get_user_from_session returns existing user
  # saved in session (if there is one)
  def get_contactor_from_session

  end

  def volunteer
    @joinactivity=ActivityEmployee.new
    @joinactivity.attendee_id=Employee.where(emp_badge: current_user.badge).first.emp_id
    @joinactivity.activity_id=@activity.activity_id
    @joinactivity.is_activisty_volunteer='Y'
    if @joinactivity.save
      redirect_to @activity, notice: 'You join the activity as volunteer successfully.'
    else
      render text: 'something is wrong'
    end
  end
  def join

    @joinactivity=ActivityEmployee.new
    @joinactivity.attendee_id=Employee.where(emp_badge: current_user.badge).first.emp_id
    @joinactivity.activity_id=@activity.activity_id

    if @joinactivity.save
      redirect_to @activity, notice: 'You join the activity successfully.'
    else
      render text: 'something is wrong'
    end

  end
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_activity
      @activity = Activity.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def activity_params
      params.require(:activity).permit(:activity_name, :activity_type, :startdate, :starttime, :endtime, :venues, :durringtime, :presenter, :descriptions, :volunteers, :attendees, :has_award,:award_id, :department_id, :language_type, :status, :activity_name_eng, :venues_eng, :remark, :contact_id, :operator, :create_time, :update_time,contactor_attributes:[:emp_name, :emp_badge, :emp_phone,:emp_mobile,:emp_email])
    end

end
