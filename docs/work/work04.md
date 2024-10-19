# sql练习

## 1. 介绍

## 2. 代码

```sql
    --  1. 查询所有员工的姓名、邮箱和工作岗位。
select  CONCAT(first_name, ' ', last_name) name, email,departments.dept_name
from employees
join departments on employees.dept_id = departments.dept_id;

-- 2. 查询所有部门的名称和位置。

select dept_name,location
from departments;

--  3. 查询工资超过70000的员工姓名和工资。
select CONCAT(first_name, ' ', last_name) name,salary
from employees
where salary>70000;
-- 4. 查询IT部门的所有员工。
select *
from employees
where employees.dept_id in (
        select dept_id
        from departments
        where departments.dept_name = 'IT'
    );

-- 5. 查询入职日期在2020年之后的员工信息。
    select *
    from employees
    where YEAR(hire_date)>2020;

-- 6. 计算每个部门的平均工资。
    select dept_id, avg(salary)
    from employees
    group by dept_id;

-- 7. 查询工资最高的前3名员工信息。
select *
from employees
order by salary desc
limit 3;
-- 8. 查询每个部门员工数量。
select dept_id, count(emp_id)
from employees
group by dept_id;
-- 9. 查询没有分配部门的员工。
select *
from employees
where dept_id is null ;
-- 10. 查询参与项目数量最多的员工。
WITH ranked_employees AS (
    SELECT emp_id, RANK() OVER (ORDER BY COUNT(project_id) DESC) AS rnk
    FROM employee_projects
    GROUP BY emp_id
)

SELECT e.*
FROM employees e
JOIN (
    SELECT emp_id
    FROM ranked_employees
    WHERE rnk = 1
) r ON e.emp_id = r.emp_id;



-- 11. 计算所有员工的工资总和。

    select sum(employees.salary)
    from employees;

-- 12. 查询姓"Smith"的员工信息。
select *
from employees
where last_name='Smith';
-- 13. 查询即将在半年内到期的项目。

    select *
    from projects
    where end_date<= adddate(start_date, INTERVAL 6 MONTH);
-- 14. 查询至少参与了两个项目的员工。

    with proNum as (
        select emp_id,count(*) as pnum
        from employee_projects
        group by emp_id
        having pnum>=2
    )


    select *
    from employees
    join proNum on proNum.emp_id=employees.emp_id;
-- 15. 查询没有参与任何项目的员工。
select *
from employees
where emp_id not in (
    select emp_id
    from employee_projects
    );
-- 16. 计算每个项目参与的员工数量。
select project_id,count(*) as num
from employee_projects
group by project_id;
-- 17. 查询工资第二高的员工信息。

select *
from employees
join (
    SELECT emp_id, RANK() OVER (ORDER BY salary DESC) AS r
    FROM employees
    WHERE salary < (SELECT MAX(salary) FROM employees)
) sr on employees.emp_id= sr.emp_id
where r=1;
-- 18. 查询每个部门工资最高的员工。
SELECT *
FROM (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
    FROM employees
) AS ranked_employees
WHERE rn = 1;
-- 19. 计算每个部门的工资总和,并按照工资总和降序排列。
    select dept_id,sum(salary) as ts
    from employees
    group by dept_id
    order by  ts desc ;
-- 20. 查询员工姓名、部门名称和工资。
    select concat(first_name,last_name), dept_name ,salary
    from employees
    join departments on employees.dept_id = departments.dept_id;
-- 21. 查询每个员工的上级主管(假设emp_id小的是上级)。

select e2.emp_id,e1.first_name,e1.last_name
from employees e1
join employees e2 on e1.emp_id -1 = e2.emp_id;

-- 22. 查询所有员工的工作岗位,不要重复。

    select distinct employees.job_title
    from employees;



-- 23. 查询平均工资最高的部门。

select *
from (  select dept_id,avg(salary) as avgs,rank() over (order by avg(salary) desc) as rnk
        from employees
        group by dept_id) as avS
where rnk=1;

-- 24. 查询工资高于其所在部门平均工资的员工。
    with avgSalary as (
        select dept_id,avg(salary) as avgs
        from employees
        group by dept_id
    )
    select *
    from employees
    join avgSalary on employees.dept_id=avgSalary.dept_id
    where employees.salary>avgs;
-- 25. 查询每个部门工资前两名的员工。
    select *
    from employees
    join (
        select emp_id,dept_id,RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
        from employees
    ) as rn on employees.dept_id=rn.dept_id and employees.emp_id=rn.emp_id
    where rnk<=2;
-- 26. 查询跨部门的项目(参与员工来自不同部门)。

    select employee_projects.project_id
    from employee_projects
    join employees on employee_projects.emp_id=employees.emp_id
    group by employee_projects.project_id
    having count(distinct dept_id)>1;
-- 27. 查询每个员工的工作年限,并按工作年限降序排序。
    select emp_id,DATEDIFF(NOW(),hire_date)/365 as work_years
    from employees
    order by work_years desc;
-- 28. 查询本月过生日的员工(假设hire_date是生日)。
    select *
    from employees
    where MONTH(hire_date)=MONTH(NOW());
-- 29. 查询即将在90天内到期的项目和负责该项目的员工。
    select *
    from projects
    where end_date>=CURDATE() and end_date<= DATE_ADD(CURDATE());
-- 30. 计算每个项目的持续时间(天数)。
    select project_id,DATEDIFF(end_date,start_date) as duration
    from projects;
-- 31. 查询没有进行中项目的部门。
    select distinct dept_id
    from employees
    where dept_id not in (
        select dept_id
        from employee_projects
        join employees on employees.emp_id = employee_projects.emp_id
    );
-- 32. 查询员工数量最多的部门。
    with dnum as ( select dept_id, rank() over (order by count(emp_id) desc) as rn
    from employees
    group by dept_id  )
    select dnum.dept_id
    from dnum
    where rn = 1;
-- 33. 查询参与项目最多的部门。
    with dnum as (     select dept_id,rank() over (order by count(DISTINCT project_id) desc) as rn
    from employee_projects
    join employees on employee_projects.emp_id=employees.emp_id
    group by dept_id )

    select *
    from dnum
    where rn = 1;
-- 34. 计算每个员工的薪资涨幅(假设每年涨5%)。
    select emp_id,salary,salary*1.05 as new_salary
    from employees;

-- 35. 查询入职时间最长的3名员工。
    select *
    from employees
    order by hire_date
    limit 3;
-- 36. 查询名字和姓氏相同的员工。
    select *
    from employees
    where first_name=last_name;
-- 37. 查询每个部门薪资最低的员工。
    select *
    from (    select *, rank() over (partition by dept_id order by salary ) as rn
    from employees) as rnk
    where rn = 1;

-- 38. 查询哪些部门的平均工资高于公司的平均工资。

    select dept_id,avg(salary) as avgs
    from employees
    group by dept_id
    having avgs > (select avg(salary) from employees);
-- 39. 查询姓名包含"son"的员工信息。
    select *
    from employees
    where first_name like '%son%';
-- 40. 查询所有员工的工资级别(可以自定义工资级别)。
SELECT
    emp_id,
    salary,
    CASE
        WHEN salary < 30000 THEN '低薪'
        WHEN salary >= 30000 AND salary < 60000 THEN '中薪'
        WHEN salary >= 60000 AND salary < 90000 THEN '高薪'
        WHEN salary >= 90000 THEN '超高薪'
        ELSE '未知'
    END AS salary_level
FROM
    employees;
-- 41. 查询每个项目的完成进度(根据当前日期和项目的开始及结束日期)。
    select project_id, case when NOW() between start_date and end_date then datediff(now(),start_date)/datediff(end_date,start_date)
                            else '完成' end as progress
    from projects;


-- 42. 查询每个经理(假设job_title包含'Manager'的都是经理)管理的员工数量。
    select e.emp_id,count(e.emp_id)-1 as num
    from employees e
    join employees m on e.dept_id=m.dept_id
    where e.emp_id in (select emp_id from employees where job_title like '%Manager%')
    group by e.emp_id;

-- 43. 查询工作岗位名称里包含"Manager"但不在管理岗位(salary<70000)的员工。
    select e.emp_id,e.first_name,e.last_name,e.job_title
    from employees e
    join employees m on e.dept_id=m.dept_id
    where e.emp_id in (select emp_id from employees where job_title like '%Manager%')
    and e.salary<70000;

-- 44. 计算每个部门的男女比例(假设以名字首字母A-M为女性,N-Z为男性)。
select
    dept_id,
    sum(case when first_name regexp '^[A-M]' then 1 else 0 end) as female_count,
    sum(case when first_name regexp '^[N-Z]' then 1 else 0 end) as male_count
from
    employees
group by
    dept_id;

-- 45. 查询每个部门年龄最大和最小的员工(假设hire_date反应了年龄)。
    select dept_id,max(hire_date) as max_age,min(hire_date) as min_age
    from employees
    group by dept_id;

-- 46. 查询连续3天都有员工入职的日期。
WITH EmployeeHireDates AS (
    SELECT DISTINCT hire_date
    FROM employees
),
ConsecutiveDays AS (
    SELECT
        hire_date,
        LAG(hire_date, 1) OVER (ORDER BY hire_date) AS prev_day_1,
        LAG(hire_date, 2) OVER (ORDER BY hire_date) AS prev_day_2
    FROM EmployeeHireDates
)
SELECT
    hire_date,
    prev_day_1,
    prev_day_2
FROM ConsecutiveDays
WHERE
    hire_date = DATE_ADD(prev_day_1, INTERVAL 1 DAY)
    AND prev_day_1 = DATE_ADD(prev_day_2, INTERVAL 1 DAY);

-- 47. 查询员工姓名和他参与的项目数量。
    select concat(e.first_name,' ',e.last_name) name,count(*) as num
    from employee_projects ep
    join employees e on e.emp_id=ep.emp_id
    group by e.emp_id;
-- 48. 查询每个部门工资最高的3名员工。
-- 48. 查询每个部门工资最高的3名员工。
WITH RankedEmployees AS(
    SELECT
        e.dept_id,
        e.emp_id,
        e.first_name,
        e.last_name,
        e.salary,
        RANK() OVER ( PARTITION BY e.dept_id ORDER BY e.salary DESC) rn
    FROM employees e
)
SELECT
    dept_id,
    emp_id,
    first_name,
    last_name,
    salary
FROM RankedEmployees
WHERE rn <= 3
ORDER BY dept_id, rn;

-- 49. 计算每个员工的工资与其所在部门平均工资的差值。
    with avg_salary as (
        select dept_id,avg(salary) as avgs
        from employees
        group by dept_id
    )
    select e.emp_id,e.first_name,e.last_name,e.salary-avgs as diff
    from employees e
    join avg_salary as a on e.dept_id=a.dept_id;

-- 50. 查询所有项目的信息,包括项目名称、负责人姓名(假设工资最高的为负责人)、开始日期和结束日期。

-- 49. 查询每个项目的最高工资员工
WITH MaxSalary AS (
    SELECT
        p.project_id,
        MAX(e.salary) AS max_salary
    FROM projects p
    JOIN employee_projects ep ON p.project_id = ep.project_id
    JOIN employees e ON e.emp_id = ep.emp_id
    GROUP BY p.project_id
),
MaxSalaryEmployees AS (
    SELECT
        p.project_id,
        e.emp_id,
        e.first_name,
        e.last_name,
        e.salary,
        p.project_name,
        p.start_date,
        p.end_date
    FROM projects p
    JOIN employee_projects ep ON p.project_id = ep.project_id
    JOIN employees e ON e.emp_id = ep.emp_id
    JOIN MaxSalary ms ON p.project_id = ms.project_id AND e.salary = ms.max_salary
)

SELECT
    mse.project_id,
    mse.project_name,
    mse.first_name,
    mse.last_name,
    mse.salary,
    mse.start_date,
    mse.end_date
FROM MaxSalaryEmployees mse
ORDER BY mse.project_id;


#-------------------------------------------------

#1. 查询所有学生的信息。
    select *
    from student;
#2. 查询所有课程的信息。
    select *
    from course;
#3. 查询所有学生的姓名、学号和班级。
    select name,student_id,my_class
    from student;
#4. 查询所有教师的姓名和职称。
    select name,title
    from teacher;
#5. 查询不同课程的平均分数。
    select course_id, avg(score) as avg_score
    from score
    group by course_id;

#6. 查询每个学生的平均分数。
    select student_id,avg(score) as avg_score
    from score
    group by student_id;
#7. 查询分数大于85分的学生学号和课程号。
    select student_id,course_id
    from score
    where score>85;
#8. 查询每门课程的选课人数。
    select course_id,count(*) as num
    from score
    group by course_id;
#9. 查询选修了"高等数学"课程的学生姓名和分数。
    select student.name,s.score
    from score s
    join course c on s.course_id=c.course_id
    join student on s.student_id = student.student_id
    where c.course_name='高等数学';
#10. 查询没有选修"大学物理"课程的学生姓名。
    select name
    from student
    where student_id not in (
        select s.student_id
        from score s
        join course c on s.course_id=c.course_id
        where c.course_name='大学物理'
        );
#11. 查询C001比C002课程成绩高的学生信息及课程分数。

    SELECT
    s1.student_id,
    s1.score AS C001_score,
    s2.score AS C002_score
FROM
    score s1
JOIN
    score s2
ON
    s1.student_id = s2.student_id
WHERE
    s1.course_id = 'C001'
    AND s2.course_id = 'C002'
    AND s1.score > s2.score;
#12. 统计各科成绩各分数段人数：课程编号，课程名称，[100-85]，[85-70]，[70-60]，[60-0] 及所占百分比

    SELECT
    c.course_id,
    c.course_name,
    SUM(CASE WHEN s.score BETWEEN 85 AND 100 THEN 1 ELSE 0 END) AS '[100-85]',
    SUM(CASE WHEN s.score BETWEEN 70 AND 84 THEN 1 ELSE 0 END) AS '[85-70]',
    SUM(CASE WHEN s.score BETWEEN 60 AND 69 THEN 1 ELSE 0 END) AS '[70-60]',
    SUM(CASE WHEN s.score BETWEEN 0 AND 59 THEN 1 ELSE 0 END) AS '[60-0]',
    (SUM(CASE WHEN s.score BETWEEN 85 AND 100 THEN 1 ELSE 0 END) * 100.0 / COUNT(s.student_id)) AS '[100-85_%]',
    (SUM(CASE WHEN s.score BETWEEN 70 AND 84 THEN 1 ELSE 0 END) * 100.0 / COUNT(s.student_id)) AS '[85-70_%]',
    (SUM(CASE WHEN s.score BETWEEN 60 AND 69 THEN 1 ELSE 0 END) * 100.0 / COUNT(s.student_id)) AS '[70-60_%]',
    (SUM(CASE WHEN s.score BETWEEN 0 AND 59 THEN 1 ELSE 0 END) * 100.0 / COUNT(s.student_id)) AS '[60-0_%]'
FROM
    course c
JOIN
    score s
ON
    c.course_id = s.course_id
GROUP BY
    c.course_id, c.course_name
ORDER BY
    c.course_id;
#13. 查询选择C002课程但没选择C004课程的成绩情况(不存在时显示为 null )。
    SELECT s1.student_id, s1.score AS C002_score, s2.score AS C004_score
    FROM score s1
    LEFT JOIN score s2 ON s1.student_id = s2.student_id AND s2.course_id = 'C004';
#14. 查询平均分数最高的学生姓名和平均分数。
SELECT
    s.name,
    avg_score AS highest_avg_score
FROM
    (
        SELECT
            student_id,
            AVG(score) AS avg_score
        FROM
            score
        GROUP BY
            student_id
    ) AS avg_scores
JOIN
    student s
ON
    avg_scores.student_id = s.student_id
ORDER BY
    avg_scores.avg_score DESC
LIMIT 1;

#15. 查询总分最高的前三名学生的姓名和总分。
    SELECT
    s.name,
    total_score
FROM
    (
        SELECT
            student_id,
            SUM(score) AS total_score
        FROM
            score
        GROUP BY
            student_id
    ) AS total_scores
JOIN
    student s
ON
    total_scores.student_id = s.student_id
ORDER BY
    total_scores.total_score DESC
LIMIT 3;

#16. 查询各科成绩最高分、最低分和平均分。要求如下：
#以如下形式显示：课程 ID，课程 name，最高分，最低分，平均分，及格率，中等率，优良率，优秀率
#及格为>=60，中等为：70-80，优良为：80-90，优秀为：>=90
#要求输出课程号和选修人数，查询结果按人数降序排列，若人数相同，按课程号升序排列
    SELECT
    c.course_id,
    c.course_name,
    MAX(s.score) AS highest_score,
    MIN(s.score) AS lowest_score,
    ROUND(AVG(s.score), 2) AS average_score,
    SUM(CASE WHEN s.score >= 60 THEN 1 ELSE 0 END) * 100.0 / COUNT(s.student_id) AS pass_rate,
    SUM(CASE WHEN s.score BETWEEN 70 AND 80 THEN 1 ELSE 0 END) * 100.0 / COUNT(s.student_id) AS medium_rate,
    SUM(CASE WHEN s.score BETWEEN 80 AND 90 THEN 1 ELSE 0 END) * 100.0 / COUNT(s.student_id) AS good_rate,
    SUM(CASE WHEN s.score >= 90 THEN 1 ELSE 0 END) * 100.0 / COUNT(s.student_id) AS excellent_rate,
    COUNT(s.student_id) AS enrollment_count
FROM
    course c
JOIN
    score s
ON
    c.course_id = s.course_id
GROUP BY
    c.course_id, c.course_name
ORDER BY
    enrollment_count DESC, c.course_id ;

#17. 查询男生和女生的人数。

    SELECT
    gender,
    COUNT(*) AS num
FROM
    student
GROUP BY
    gender;
#18. 查询年龄最大的学生姓名。

    SELECT
    name
FROM
    student
ORDER BY
student.birth_date
LIMIT 1;
#19. 查询年龄最小的教师姓名。
    SELECT name
    FROM teacher
    ORDER BY
    birth_date DESC
LIMIT 1;
#20. 查询学过「张教授」授课的同学的信息。
    SELECT s.*
    FROM student s
    JOIN score sc ON s.student_id = sc.student_id
    JOIN course c ON sc.course_id = c.course_id
    JOIN teacher t ON c.teacher_id = t.teacher_id
    WHERE t.name = '张教授';
#21. 查询查询至少有一门课与学号为"2021001"的同学所学相同的同学的信息 。
    SELECT DISTINCT s.*
    FROM student s
    JOIN score sc ON s.student_id = sc.student_id
    JOIN course c ON sc.course_id = c.course_id
    JOIN student stu ON sc.student_id != stu.student_id
    WHERE stu.student_id = '2021001';
#22. 查询每门课程的平均分数，并按平均分数降序排列。
    SELECT c.course_name, AVG(s.score) AS avg_score
    FROM course c
    JOIN score s ON c.course_id = s.course_id
    GROUP BY c.course_name
    ORDER BY avg_score DESC;
#23. 查询学号为"2021001"的学生所有课程的分数。
    SELECT s.student_id, c.course_name, s.score
    FROM score s
    JOIN course c ON s.course_id = c.course_id
    WHERE s.student_id = '2021001';

#24. 查询所有学生的姓名、选修的课程名称和分数。
    SELECT stu.name, c.course_name, s.score
    FROM score s
    JOIN course c ON s.course_id = c.course_id
    JOIN student stu ON s.student_id = stu.student_id;
#25. 查询每个教师所教授课程的平均分数。
    SELECT t.name, AVG(s.score) AS avg_score
    FROM score s
    JOIN course c ON s.course_id = c.course_id
    JOIN teacher t ON c.teacher_id = t.teacher_id
    GROUP BY t.name;
#26. 查询分数在80到90之间的学生姓名和课程名称。
    SELECT stu.name, c.course_name
    FROM score s
    JOIN course c ON s.course_id = c.course_id
    JOIN student stu ON s.student_id = stu.student_id
    WHERE s.score BETWEEN 80 AND 90;
#27. 查询每个班级的平均分数。
    SELECT stu.my_class, AVG(s.score) AS avg_score
    FROM score s
    JOIN course c ON s.course_id = c.course_id
    JOIN student stu ON s.student_id = stu.student_id
    GROUP BY stu.my_class;
#28. 查询没学过"王讲师"老师讲授的任一门课程的学生姓名。
SELECT
    s.name
FROM
    student s
WHERE
    s.student_id NOT IN (
        SELECT
            sc.student_id
        FROM
            score sc
        JOIN
            course ct
        ON
            sc.course_id = ct.course_id
        JOIN
            teacher t
        ON
            ct.teacher_id = t.teacher_id
        WHERE
            t.name = '王讲师'
    );

#29. 查询两门及其以上小于85分的同学的学号，姓名及其平均成绩 。
    SELECT stu.student_id, stu.name, AVG(s.score) AS avg_score
    FROM student stu
    JOIN score s ON stu.student_id = s.student_id
    GROUP BY stu.student_id, stu.name
    HAVING COUNT(s.score) >= 2 AND AVG(s.score) < 85;
#30. 查询所有学生的总分并按降序排列。
    SELECT stu.student_id, stu.name, SUM(s.score) AS total_score
    FROM student stu
    JOIN score s ON stu.student_id = s.student_id
    GROUP BY stu.student_id, stu.name
    ORDER BY total_score DESC;
#31. 查询平均分数超过85分的课程名称。
    SELECT c.course_name
    FROM score s
    JOIN course c ON s.course_id = c.course_id
    GROUP BY c.course_name
    HAVING AVG(s.score) > 85;
#32. 查询每个学生的平均成绩排名。
    SELECT stu.student_id, stu.name, RANK() OVER (ORDER BY AVG(s.score) DESC) AS rn
    FROM student stu
    JOIN score s ON stu.student_id = s.student_id
    GROUP BY stu.student_id, stu.name;
#33. 查询每门课程分数最高的学生姓名和分数。
SELECT
    c.course_id,
    c.course_name,
    s.name,
    max_scores.max_score
FROM
    (
        SELECT
            course_id,
            MAX(score) AS max_score
        FROM
            score
        GROUP BY
            course_id
    ) AS max_scores
JOIN
    score sc
ON
    max_scores.course_id = sc.course_id
    AND max_scores.max_score = sc.score
JOIN
    course c
ON
    sc.course_id = c.course_id
JOIN
    student s
ON
    sc.student_id = s.student_id
ORDER BY
    c.course_id;

#34. 查询选修了"高等数学"和"大学物理"的学生姓名。
    SELECT stu.name
    FROM score s
    JOIN course c ON s.course_id = c.course_id
    JOIN student stu ON s.student_id = stu.student_id
    WHERE c.course_name IN ('高等数学', '大学物理');
#35. 按平均成绩从高到低显示所有学生的所有课程的成绩以及平均成绩（没有选课则为空）。

    SELECT
        stu.name,
        c.course_name,
        s.score,
        AVG(s.score) OVER (PARTITION BY stu.student_id) AS avg_score
    FROM
        student stu
    LEFT JOIN
        score s ON stu.student_id = s.student_id
    JOIN
        course c ON s.course_id = c.course_id
    ORDER BY
        stu.student_id, c.course_name;
#36. 查询分数最高和最低的学生姓名及其分数。
-- 找到最高分和最低分
WITH ScoreStats AS (
    SELECT
        MAX(score) AS max_score,
        MIN(score) AS min_score
    FROM
        score
)

-- 找到最高分和最低分对应的学生姓名
SELECT
    max_stu.name AS max_student_name,
    max_s.score AS max_score,
    min_stu.name AS min_student_name,
    min_s.score AS min_score
FROM
    ScoreStats
JOIN
    score max_s ON ScoreStats.max_score = max_s.score
JOIN
    student max_stu ON max_s.student_id = max_stu.student_id
JOIN
    score min_s ON ScoreStats.min_score = min_s.score
JOIN
    student min_stu ON min_s.student_id = min_stu.student_id;

#37. 查询每个班级的最高分和最低分。
    SELECT stu.my_class, MAX(s.score) AS max_score, MIN(s.score) AS min_score
    FROM score s
    JOIN student stu ON s.student_id = stu.student_id
    GROUP BY stu.my_class;
#38. 查询每门课程的优秀率（优秀为90分）。
    SELECT c.course_name, COUNT(*) AS total_students,
           SUM(CASE WHEN s.score >= 90 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS excellent_rate
    FROM score s
    JOIN course c ON s.course_id = c.course_id
    GROUP BY c.course_name;

#39. 查询平均分数超过班级平均分数的学生。
    SELECT stu.student_id, stu.name, AVG(s.score) AS avg_score
    FROM score s
    JOIN student stu ON s.student_id = stu.student_id
    GROUP BY stu.student_id
    HAVING AVG(s.score) > (
        SELECT AVG(s2.score)
        FROM score s2
    );
#40. 查询每个学生的分数及其与课程平均分的差值。
    SELECT stu.student_id, stu.name, s.score, AVG(s.score) OVER (PARTITION BY stu.student_id) - s.score AS diff
    FROM score s
    JOIN student stu ON s.student_id = stu.student_id;

#41. 查询至少有一门课程分数低于80分的学生姓名。
    SELECT stu.name
    FROM score s
    JOIN student stu ON s.student_id = stu.student_id
    GROUP BY stu.student_id
    HAVING COUNT(s.score) >= 1 AND AVG(s.score) < 80;
#42. 查询所有课程分数都高于85分的学生姓名。
    SELECT stu.name
    FROM score s
    JOIN student stu ON s.student_id = stu.student_id

    GROUP BY stu.student_id
    HAVING AVG(s.score) > 85;
#43. 查询查询平均成绩大于等于90分的同学的学生编号和学生姓名和平均成绩。
    SELECT stu.student_id, stu.name, AVG(s.score) AS avg_score
    FROM score s
    JOIN student stu ON s.student_id = stu.student_id
    GROUP BY stu.student_id
    HAVING AVG(s.score) >= 90;
#44. 查询选修课程数量最少的学生姓名。
    with class_count AS (
        SELECT stu.student_id, COUNT(*) AS course_count
        FROM score s
        JOIN student stu ON s.student_id = stu.student_id
        GROUP BY stu.student_id
    )
    select name
    from (
        select student_id, rank() over (order by course_count ) as rn
    from class_count
         ) as cc
    left join student s on cc.student_id=s.student_id
    where rn =1;


#45. 查询每个班级的第2名学生（按平均分数排名）。
    with avg_scores AS (
            select stu.student_id, AVG(s.score) as avg_score
    from student stu
    join score s on stu.student_id=s.student_id
    group by stu.student_id
    )
    select my_class,student_id, avg_score
    from (
        select s.my_class,s.student_id,a.avg_score, rank() over (partition by s.my_class order by avg_score desc) as rn
    from student s
    join avg_scores a on s.student_id=a.student_id
         ) as fs
    where rn =2;

#46. 查询每门课程分数前三名的学生姓名和分数。
WITH RankedScores AS (
    SELECT
        s.student_id,
        s.name,
        sc.course_id,
        sc.score,
        RANK() OVER (PARTITION BY sc.course_id ORDER BY sc.score DESC) AS rn
    FROM
        student s
    JOIN
        score sc
    ON
        s.student_id = sc.student_id
)
SELECT
    rs.course_id,
    rs.name,
    rs.score
FROM
    RankedScores rs
WHERE
    rs.rn <= 3
ORDER BY
    rs.course_id, rs.rn;

#47. 查询平均分数最高和最低的班级。
with class_avg AS (
    select my_class, avg(score) as avg_score
    from student
    join score on student.student_id = score.student_id
    group by my_class
),
max_min_avg AS (
    select max(avg_score) as max_avg, min(avg_score) as min_avg
    from class_avg
)
select
    max_c.my_class as max_class, max_c.avg_score as max_avg,
    min_c.my_class as min_class, min_c.avg_score as min_avg
from
    class_avg max_c
join
    max_min_avg max_s on max_c.avg_score = max_s.max_avg
join
    class_avg min_c on min_c.avg_score = (select min_avg from max_min_avg);


#48. 查询每个学生的总分和他所在班级的平均分数。
    with class_avg AS (
        SELECT stu.my_class, AVG(s.score) AS avg_score
        FROM score s
        JOIN student stu ON s.student_id = stu.student_id
        GROUP BY stu.my_class
    )
    SELECT stu.student_id, stu.name, SUM(s.score) AS total_score, ca.avg_score
    FROM score s
    JOIN student stu ON s.student_id = stu.student_id
    JOIN class_avg ca ON stu.my_class = ca.my_class
    GROUP BY stu.student_id;
#49. 查询每个学生的最高分的课程名称, 学生名称，成绩。

    with max_scores AS (
        SELECT student_id, MAX(score) AS max_score
        FROM score
        GROUP BY student_id
        order by max_score desc
    )
    select  s.student_id, stu.name, c.course_name, s.score
    from score s
    join student stu on s.student_id = stu.student_id
    join course c on s.course_id = c.course_id
    join max_scores ms on s.student_id = ms.student_id and s.score = ms.max_score;

#50. 查询每个班级的学生人数和平均年龄。
SELECT
    stu.my_class,
    COUNT(stu.student_id) AS num_students,
    AVG(year(now())-year(stu.birth_date)) AS avg_age
FROM
    student stu
GROUP BY
    stu.my_class;




```
