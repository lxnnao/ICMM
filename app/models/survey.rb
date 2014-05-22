class Survey < ActiveRecord::Base
	establish_connection("eic_dev")
  	self.table_name = 'im_survey'
  	self.primary_key = 'survey_id'
	has_many :survey_questions,:class_name => 'Question' ,:primary_key => 'survey_id', :foreign_key => "survey_id",:dependent => :destroy
	accepts_nested_attributes_for :survey_questions,:reject_if => lambda { |a| a[:question_content].blank?
}, :allow_destroy => true

  before_create do
    self.survey_id = self.connection.execute("select EIC.im_survey_id_SEQ.nextval id from dual").fetch[0].round
  end
end
