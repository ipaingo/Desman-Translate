import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import placeholder from "../images/placeholder.png";
import { Col, Button, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom"

import React, { useEffect, useState } from "react"

let cur_user = ""
if (localStorage.getItem("user") != null) {
  cur_user = JSON.parse(localStorage.getItem("user"))
}



export default function User() {

  const [projects, setProjects] = useState([]);
  const [username, setUsername] = useState([]);
  const [about, setAbout] = useState([]);
  const link = useParams()
  console.log(link["id"])

  const flag_same_user = (cur_user.id == link["id"])


  let navigate = useNavigate();
  const routeChange = () => {
    let path = '/create';
    navigate(path);
  }

  async function Get_projects() {
    let arr_jsx = []
    let aboba = await fetch("/api/users/" + link["id"])
      .then(response => response.json())
      .then(data => data.projects)

    let count = aboba.length
    let project_elems = []
    aboba.forEach(async elem => {
      await fetch("/api/projects/" + elem)
        .then(response => response.json())
        .then(data_project => {
          project_elems.push(data_project)
          let c = 0
          if (project_elems.length == count) {
            project_elems.forEach(elem => {
              fetch("/api/projects/" + elem.id + "/members/" + link["id"])
                .then(response => response.json())
                .then(data_role => {
                  arr_jsx.push(
                    <Row className="border rounded py-3 align-items-center" style={{ marginTop: '5px' }}>
                      <Col className="text-left">
                        <strong>
                          <Link className="link-primary" to={"/projects/" + elem.handle}>{elem.name}</Link>
                        </strong>
                        <br /> Роль: {data_role.role_name}
                      </Col>
                    </Row>
                  )
                  c++
                  if (c == count)
                    setProjects(arr_jsx)
                })
            })
          }
        })
    })
  }

  let user

  async function Get_user_info() {
    return fetch("/api/users/" + link["id"])
      .then(response => response.json())
      .then(data => {
        setUsername(data.username)
        let about = data.about
        if (data.about == undefined) {
          about = "Пользователь еще не добавил описание"
        }
        data.about = about
        setAbout(about)
        user = data
      })
  }

  useEffect(() => {
    Get_projects();
  }, []);

  useEffect(() => {
    Get_user_info()
  }, []);

  return (
    <>
      <Navbar />

      <div className="container" style={{ marginTop: '50px' }}>
        <h1 style={{ marginTop: '20px', marginBottom: '20px' }}>{username}</h1>

        <Tabs
          defaultActiveKey="user"
          id="project-id-tabs"
          className="mb-3"
        >
          <Tab eventKey="user" title="Пользователь">

            <Row>
              <Col md={5} className="border rounded" style={{ marginLeft: '10px', padding: '10px' }}>
                <img src={placeholder} height={200} alt="project cover" style={{ float: 'left', padding: '10px', margin: '0px 10px 0px 0px' }} className="border rounded" />
                <h3>{username}</h3>
                <h3>О вас</h3>
                <p>{about}</p>
              </Col>
              <Col className="py-3" style={{ marginLeft: '10px', marginRight: '20px', paddingLeft: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>Участие в проектах</h2>
                <Button variant="primary" style={{ marginTop: '0px', marginBottom: '5px' }} onClick={routeChange}>Создать проект</Button>
                <div className="container text-left" style={{ paddingBottom: '10px' }}>
                  {projects}
                </div>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="settings" title="Настройки">
            <h3 style={{ marginTop: '20px', marginBottom: '20px' }}>Настройки пользователя</h3>
            <div id="settings-user" className="border rounded py-3" style={{ padding: '0px 20px', marginBottom: '10px' }}>
              <form className="row">
                <label htmlFor="settings-user-id" className="form-label">Уникальный хэндл</label>
                <div className="col-auto">
                  <input type="text" className="form-control is-valid" id="settings-user-id" minLength={4} maxLength={100} defaultValue="lazy_desman" />
                  <div className="valid-feedback">Можно использовать!</div>
                  <div className="invalid-feedback">Такая ссылка уже занята!</div>
                </div>
                <div className="col">
                  <button className="btn btn-primary" type="submit">Применить</button>
                </div>
              </form>
              <form>
                <label htmlFor="settings-user-name" className="form-label">Имя пользователя</label>
                <input type="text" className="form-control" id="settings-user-name" defaultValue="Ленивая выхухоль" minLength={4} maxLength={100} />
                <label htmlFor="settings-user-description" className="form-label" style={{ marginTop: '10px' }}>Описание пользователя</label>
                <textarea className="form-control" aria-label="With textarea" id="settings-user-description" maxLength={1000} placeholder="Напишите здесь все, что хотели бы рассказать о себе: род деятельности, любимые жанры, какими языками вы владеете..." defaultValue={""} />
                <label htmlFor="settings-user-avatar" className="form-label" style={{ marginTop: '10px' }}>Сменить аватар</label>
                <input type="file" className="form-control" id="settings-user-avatar" accept="image/png, image/jpeg" aria-describedby="logo-desc" />
                <div id="logo-desc" className="form-text">
                  Принимаются картинки в формате .png и .jpeg
                </div>
                <label htmlFor="settings-user-gender" className="form-label" style={{ marginTop: '10px' }}>Пол</label>
                <select className="form-select" id="settings-user-gender">
                  <option value="none" selected>не выбрано</option>
                  <option value="m">мужской</option>
                  <option value="f">женский</option>
                </select>
                <label htmlFor="settings-user-access" className="form-label" style={{ marginTop: '10px' }}>Доступ к аккаунту</label>
                <div className="form-check">
                  <input type="radio" name="radios" className="form-check-input" id="settings-account-private" defaultValue="private" defaultChecked />
                  <label className="form-check-label" htmlFor="settings-account-private">Открытый</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="radios" className="form-check-input" id="settings-account-public" defaultValue="public" />
                  <label className="form-check-label" htmlFor="settings-account-public">Закрытый</label>
                </div>
              </form>
              <button className="btn btn-primary" type="submit" style={{ marginTop: '20px' }}>Применить</button>
            </div>



          </Tab>
        </Tabs>



        {/* настройки. */}


      </div>

      <Footer />
    </>
  );
}