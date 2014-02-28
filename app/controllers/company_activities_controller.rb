class CompanyActivitiesController < ApplicationController
  def index
  	@activitys=CompanyActivity.all
  end

  # GET /companyactivitys/1
  # GET /companyactivitys/1.json
  def show
    @activity = CompanyActivity.find(params[:id])
    @last_name = cookies[:last_name]
    unless @last_name == nil
      @name = cookies[:name]
    end
    @names = session[:names]


    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @activity }
    end
  end
  # GET /companyactivitys/new
  def new
    @activity = CompanyActivity.new
  end

  def edit
  end

  # POST /companyactivitys
  # POST /companyactivitys.json
  def create
    @companyactivity = CompanyActivity.new(activity_params)

    respond_to do |format|
      if @companyactivity.save
        format.html { redirect_to @companyactivity, notice: 'CompanyActivity was successfully created.' }
        format.json { render action: 'show', status: :created, location: @companyactivity }
      else
        format.html { render action: 'new' }
        format.json { render json: @companyactivity.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /companyactivitys/1
  # PATCH/PUT /companyactivitys/1.json
  def update
    respond_to do |format|
      if @companyactivity.update(activity_params)
        format.html { redirect_to @companyactivity, notice: 'CompanyActivity was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @companyactivity.errors, status: :unprocessable_entity }
      end
    end
  end
  # DELETE /companyactivitys/1
  # DELETE /companyactivitys/1.json
  def destroy
    @companyactivity.destroy
    respond_to do |format|
      format.html { redirect_to companyactivity_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_activity
      @companyactivity = CompanyActivity.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def activity_params
      params.require(:company_activity).permit(:action_sys_id, :action_type)
    end

end