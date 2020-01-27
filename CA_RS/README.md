# DinoDino Course Recommendation System
## Usage
- Firstly, make sure there's a ```res``` folder in this path
- You should change the db name and other parameter to your own at ```func.py``` file
### Preprocessing
- File name: ```preprocess.py```
- Currently we use KMeans and SpectralClustering to cluster students
- You can change number of cluster and some parameter of these two method
### Predict
- File name: ```predict.py```
- After running previous steps, you should run this code
- ```Top_K``` variable means how many courses this will recommend to every students
- ```Type``` variable indicate the type of this program, ```test``` mode for evaluating which clustering method perform well, ```eval``` mode for generating the recommended courses for next semester
- Notice that you should also change ```cur_setting``` according to what ```Type``` variable you set.
    - For ```test mode```, you must have the student's score in your database
    - For ```eval mode```, you must have the courses information (cos_data) in your database
### Import to DB
- After generate recommended courses, you should load the result (```blablabla_pred_db.csv```) to the ```rs``` table

## Method
- You can check current method in [this slide](https://docs.google.com/presentation/d/1UGC2MScogFl3xyuqXILAfB3GX5JqXyUVvVotVRbQRIg/edit?usp=sharing)