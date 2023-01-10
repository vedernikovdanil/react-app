import "./FilterTab.css";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { FilterResult } from "../../../models/Filter";
import FilterItem from "../FilterItem";

function FilterTab(props: { filterList: FilterResult[] }) {
  return (
    <Tab.Container defaultActiveKey={props.filterList[0].name}>
      <Row className="filter-tab h-100 overflow-hidden gx-2 gx-sm-3">
        <Col xs="3" className="w-auto">
          <Nav variant="pills" className="flex-column">
            {props.filterList.map((filter, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  eventKey={filter.name}
                  className={`border fs-7-auto mb-2 ${
                    !filter.default ? "checked" : ""
                  }`}
                >
                  {filter.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col className="h-100  overflow-auto">
          <Tab.Content>
            {props.filterList.map((filter, index) => (
              <Tab.Pane key={index} eventKey={filter.name}>
                <FilterItem filter={filter} />
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default FilterTab;
