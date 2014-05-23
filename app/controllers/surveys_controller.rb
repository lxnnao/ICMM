class SurveysController < ApplicationController
  before_action :set_survey, only: [:show, :edit, :update, :destroy]

  # GET /surveys
  def index
    @surveys = Survey.all
  end

  # GET /surveys/1
  def show
  end

  # GET /surveys/new
  def new
    @survey = Survey.new
  end

  # GET /surveys/1/edit
  def edit
  end

  # POST /surveys
  def create

    @survey = Survey.new(survey_params)
    if @survey.save
        @survey.survey_questions.each do |question|
        question.save
      end
      redirect_to @survey, notice: 'Survey was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /surveys/1
  def update
    if @survey.update_attributes(survey_params)
      redirect_to @survey, notice: 'Survey was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /surveys/1
  def destroy
    @survey.destroy
    redirect_to surveys_url, notice: 'Survey was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_survey
      @survey = Survey.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def survey_params
      params.require(:survey).permit(:survey_name,:survey_desciption,:publisher,:pubdate,:total_reports,:operater,survey_questions_attributes:[:question_content,:is_required,:content_type,:display_squence,:_destroy,:id,question_answers_attributes:[:answer_content,:content_type,:display_squence,:remark,:_destroy,:id]])
    end
end
