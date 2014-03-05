require 'test_helper'

class AwardsControllerTest < ActionController::TestCase
  setup do
    @award = awards(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:awards)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create award" do
    assert_difference('Award.count') do
      post :create, award: { activity_id: @award.activity_id, award_id: @award.award_id, create_time: @award.create_time, descriptions: @award.descriptions, name: @award.name, qty: @award.qty, status: @award.status, update_time: @award.update_time }
    end

    assert_redirected_to award_path(assigns(:award))
  end

  test "should show award" do
    get :show, id: @award
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @award
    assert_response :success
  end

  test "should update award" do
    patch :update, id: @award, award: { activity_id: @award.activity_id, award_id: @award.award_id, create_time: @award.create_time, descriptions: @award.descriptions, name: @award.name, qty: @award.qty, status: @award.status, update_time: @award.update_time }
    assert_redirected_to award_path(assigns(:award))
  end

  test "should destroy award" do
    assert_difference('Award.count', -1) do
      delete :destroy, id: @award
    end

    assert_redirected_to awards_path
  end
end
