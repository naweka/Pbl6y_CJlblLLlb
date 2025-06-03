from flask import Blueprint, request, send_file
from services.json_helper_service import endpoint_output_wrapper
from services.user_service import token_required
from services.card_service import (upload_file_for_card,
                                  get_card_files,
                                  remove_file)
from services.ai_service import processing_files
from services.id_generator_service import generate_id, generate_ids
from services.file_info_service import get_file_by_id
from appconfig import WORKING_DIRECTORY
from zipfile import ZipFile
from models.file_info_dto import FileInfoDto
import os
from services.converter_service import (convert_model_to_dto,
                                        __get_json_parameter)

file_controller_blueprint = Blueprint('file_controller_blueprint', __name__)

@file_controller_blueprint.route('/api/v1/generateGuid', methods=['GET'])
@token_required
@endpoint_output_wrapper
def generateGuid(jwt_data:dict) -> str:
    res = generate_id()
    return res, 200


@file_controller_blueprint.route('/api/v1/generateGuids', methods=['POST'])
@token_required
@endpoint_output_wrapper
def generateGuids(jwt_data:dict) -> str:
    number_of_guids = __get_json_parameter(request.json, 'count')
    res = generate_ids(number_of_guids)
    return res, 200


@file_controller_blueprint.route('/api/v1/uploadFile', methods=['POST'])
@token_required
@endpoint_output_wrapper
def uploadFile(jwt_data:dict) -> None:
    fs = request.files[''] if 'file' not in request.files else request.files['file'] 
    filename = fs.filename
    file_id = request.form['fileId']
    card_id = request.form['cardId']
    data = fs.read()
    res = upload_file_for_card(card_id, file_id, filename, data)
    fs.close()
    return res, 200


@file_controller_blueprint.route('/api/v1/getFilesByCard', methods=['POST'])
@token_required
@endpoint_output_wrapper
def getFiles(jwt_data:dict) -> list[FileInfoDto]:
    id = __get_json_parameter(request.json, 'id')
    file_infos = get_card_files(id)
    res = [convert_model_to_dto(x) for x in file_infos]
    return res, 200


@file_controller_blueprint.route('/api/v1/getFile/<path:id>', methods=['GET'])
@token_required
@endpoint_output_wrapper
def getFile(jwt_data:dict, id) -> FileInfoDto:
    file_info = get_file_by_id(id)
    res = convert_model_to_dto(file_info)
    return res, 200


@file_controller_blueprint.route('/spectrogram/<path:id>', methods=['GET'])
@token_required
@endpoint_output_wrapper
def downloadSpectrogram(jwt_data:dict, id):
    path = WORKING_DIRECTORY+f'/server_data/spectrograms/{id}.png'
    if not os.path.exists(path):
        return {'error_message': f'Not found file {id}.png'}, 404
    return send_file(path, as_attachment=False), 200


@file_controller_blueprint.route('/predictedData/<path:id>', methods=['GET'])
@token_required
@endpoint_output_wrapper
def downloadPredictedData(jwt_data:dict, id):
    path = WORKING_DIRECTORY+f'/server_data/predicted_data/{id}.csv'
    if not os.path.exists(path):
        return {'error_message': f'Not found file {id}.png'}, 404
    return send_file(path, as_attachment=False), 200


@file_controller_blueprint.route('/allPredictedDataForCard/<path:id>', methods=['GET'])
@token_required
@endpoint_output_wrapper
def allPredictedDataForCard(jwt_data:dict, id):
    files = get_card_files(id)
    file_ids:list[str] = [x.id for x in files[0]]

    zipfile_path = WORKING_DIRECTORY+f'/server_data/temp/{id}.zip'
    with ZipFile(zipfile_path,'w') as zip: 
        for file_id in file_ids:
            try:
                path = WORKING_DIRECTORY+f'/server_data/predicted_data/{file_id}.csv'
                zip.write(path, f'{file_id}.csv')
            except:
                continue

    return send_file(zipfile_path, as_attachment=False), 200


@file_controller_blueprint.route('/api/v1/deleteFile', methods=['POST'])
@token_required
@endpoint_output_wrapper
def deleteFile(jwt_data:dict) -> None:
    file_id = __get_json_parameter(request.json, 'id')
    if file_id in processing_files:
        return {'error_message': f'Вы не можете удалить этот файл, так как он в процессе обработки. \
Пожалуйста, попробуйте позже'}, 400
 
    res = remove_file(file_id)
    return res, 200