class CompanyEmployeesController < ApplicationController
  def index
  	@employees=CompanyEmployee.all
  end

  # GET /companyemployees/1
  # GET /companyemployees/1.json
  def show
    @employee = CompanyEmployee.find(params[:id])
    @last_name = cookies[:last_name]
    unless @last_name == nil
      @name = cookies[:name]
    end
    @names = session[:names]


    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @employee }
    end
  end
  # GET /companyemployees/new
  def new
    @employee = CompanyEmployee.new
  end

  def edit
  end

  # POST /companyemployees
  # POST /companyemployees.json
  def create
    @employee = CompanyEmployee.new(employee_params)

    respond_to do |format|
      if @employee.save
        format.html { redirect_to @employee, notice: 'Employee info was successfully created.' }
        format.json { render action: 'show', status: :created, location: @employee }
      else
        format.html { render action: 'new' }
        format.json { render json: @employee.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /companyemployees/1
  # PATCH/PUT /companyemployees/1.json
  def update
    respond_to do |format|
      if @employee.update(employee_params)
        format.html { redirect_to @employee, notice: 'Employee info was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @employee.errors, status: :unprocessable_entity }
      end
    end
  end
  # DELETE /CompanyEmployees/1
  # DELETE /CompanyEmployees/1.json
  def destroy
    @employee.destroy
    respond_to do |format|
      format.html { redirect_to CompanyEmployee_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_activity
      @employee = CompanyEmployee.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def employee_params
      params.require(:company_activity).permit(:action_sys_id, :action_type)
    end

end