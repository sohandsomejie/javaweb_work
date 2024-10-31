# sql练习

## 1. 介绍

`TeacherController` 是一个用于处理与 `Teacher` 实体相关的 HTTP 请求的 Spring Boot 控制器类。根据提供的信息，这个控制器类包含以下方法：

1. **获取教师信息**
   - **路径**: `/getTeacher/{id}`
   - **HTTP 方法**: GET
   - **参数**: `id` 教师的唯一标识符（整数）
   - **返回值**: 返回指定 ID 的教师对象

2. **添加教师**
   - **路径**: `/addTeacher`
   - **HTTP 方法**: GET
   - **参数**: 无
   - **返回值**: 无
   - **说明**: 创建一个新的教师对象，并设置默认值后添加到数据库中。

3. **更新教师信息**
   - **路径**: `/updateTeacher/{id}`
   - **HTTP 方法**: GET
   - **参数**: `id` 教师的唯一标识符（整数）
   - **返回值**: 无
   - **说明**: 更新指定 ID 的教师信息，设置默认值后更新到数据库中。

4. **删除教师**
   - **路径**: `/deleteTeacher/{id}`
   - **HTTP 方法**: GET
   - **参数**: `id` 教师的唯一标识符（整数）
   - **返回值**: 无
   - **说明**: 删除指定 ID 的教师记录。

5. **批量添加教师**
   - **路径**: `/addTeachers`
   - **HTTP 方法**: GET
   - **参数**: 无
   - **返回值**: 无
   - **说明**: 批量添加 500 个教师记录到数据库中。

6. **获取最后两个教师**
   - **路径**: `/getTeacherAtLastTwo`
   - **HTTP 方法**: GET
   - **参数**: 无
   - **返回值**: 返回最后倒数第二教师对象
   - **说明**: 从数据库中获取倒数第二教师记录，并返回。
  
## 2. 代码

``` java
TeacherController.java

package org.example.springc1.controller;

import org.example.springc1.entity.Teacher;
import org.example.springc1.mapper.TeacherMapper;
import org.example.springc1.service.TeacherServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TeacherController {


    @Autowired
    private TeacherServiceImpl teacherServiceImpl;
    @GetMapping("/getTeacher/{id}")
    public Teacher getTeacherById(@PathVariable Integer id){
        return teacherServiceImpl.getTeacherById(id);
    }
    @GetMapping("/addTeacher")
    public void addTeacher(){
        Teacher teacher = new Teacher();
        teacher.setName("hhhh");
        teacher.setCourse("hhhh");
        teacher.setBirthday("2021-10-10");
        teacherServiceImpl.addTeacher(teacher);
    }
    @GetMapping("/updateTeacher/{id}")
    public void updateTeacher(@PathVariable Integer id){
        Teacher teacher = new Teacher();
        teacher.setName("hhhh");
        teacher.setCourse("hhhh");
        teacher.setBirthday("2021-10-10");
        teacher.setId(id);
        teacherServiceImpl.updateTeacher(teacher);
    }
    @GetMapping("/deleteTeacher/{id}")
    public void deleteTeacherById(@PathVariable Integer id){
        teacherServiceImpl.deleteTeacherById(id);
    }
    @GetMapping("/addTeachers")
    public void addTeachers(){
        teacherServiceImpl.addTeachers(500);
    }
    @GetMapping("/getTeacherAtLastTwo")
    public Teacher getTeacherAtLastTwo(){
        return teacherServiceImpl.getTeacherAtLastTwo();
    }

}



```

```java
TeacherServiceImpl.java

package org.example.springc1.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.springc1.entity.Teacher;
import org.example.springc1.mapper.TeacherMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeacherServiceImpl extends ServiceImpl<TeacherMapper, Teacher> implements TeacherService {

    @Autowired
    private TeacherMapper teacherMapper;

    @Override
    public Teacher getTeacherById(Integer id) {
        return teacherMapper.selectById(id);
    }

    @Override
    public List<Teacher> getAllTeacher() {
        return teacherMapper.selectAllTeachers();
    }

    @Override
    public Teacher getTeacherAtLastTwo() {
        List<Teacher> allTeachers = this.getAllTeacher();
        if (allTeachers.size() > 1) {
            return allTeachers.get(allTeachers.size() - 2);
        }
        return null;
    }

    @Override
    public void addTeacher(Teacher teacher) {
        teacherMapper.insert(teacher);
    }

    @Override
    @Transactional
    public void addTeachers(int n) {
        // 完成teacher表的批量插入练习，插入500个教师，每插入100条数据提交一次。
        List<Teacher> batch = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            Teacher teacher = new Teacher();
            teacher.setName("hhhh");
            teacher.setCourse("hhhh");
            teacher.setBirthday("2021-10-10");
            batch.add(teacher);
            if (batch.size() == 100 || i == n - 1) {
                teacherMapper.insert(batch);
                batch.clear();
            }
        }
    }

    @Override
    public void deleteTeacherById(Integer id) {
        teacherMapper.deleteById(id);
    }

    @Override
    public void updateTeacher(Teacher teacher) {
        teacherMapper.updateById(teacher);
    }
}

```
