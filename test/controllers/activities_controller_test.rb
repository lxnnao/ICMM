require 'test_helper'

class ActivitiesControllerTest < ActionController::TestCase
  setup do
    @activity = activities(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:activities)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create activity" do
    assert_difference('Activity.count') do
      post :create, activity: { activity_id: @activity.activity_id, activity_name: @activity.activity_name, activity_name_eng: @activity.activity_name_eng, activity_type: @activity.activity_type, attendees: @activity.attendees, contact_id: @activity.contact_id, create_time: @activity.create_time, department_id: @activity.department_id, descriptions: @activity.descriptions, durringtime: @activity.durringtime, endtime: @activity.endtime, has_award: @activity.has_award, language_type: @activity.language_type, operator: @activity.operator, presenter: @activity.presenter, remark: @activity.remark, startdate: @activity.startdate, starttime: @activity.starttime, status: @activity.status, update_time: @activity.update_time, venues: @activity.venues, venues_eng: @activity.venues_eng, volunteers: @activity.volunteers }
    end

    assert_redirected_to activity_path(assigns(:activity))
  end

  test "should show activity" do
    get :show, id: @activity
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @activity
    assert_response :success
  end

  test "should update activity" do
    patch :update, id: @activity, activity: { activity_id: @activity.activity_id, activity_name: @activity.activity_name, activity_name_eng: @activity.activity_name_eng, activity_type: @activity.activity_type, attendees: @activity.attendees, contact_id: @activity.contact_id, create_time: @activity.create_time, department_id: @activity.department_id, descriptions: @activity.descriptions, durringtime: @activity.durringtime, endtime: @activity.endtime, has_award: @activity.has_award, language_type: @activity.language_type, operator: @activity.operator, presenter: @activity.presenter, remark: @activity.remark, startdate: @activity.startdate, starttime: @activity.starttime, status: @activity.status, update_time: @activity.update_time, venues: @activity.venues, venues_eng: @activity.venues_eng, volunteers: @activity.volunteers }
    assert_redirected_to activity_path(assigns(:activity))
  end

  test "should destroy activity" do
    assert_difference('Activity.count', -1) do
      delete :destroy, id: @activity
    end

    assert_redirected_to activities_path
  end
end
