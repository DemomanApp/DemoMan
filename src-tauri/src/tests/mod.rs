use crate::demo::{read_demo, Demo};

#[test]
fn test_demo_loading() {
    use crate::demo::{read_demos_in_directory, DemoEvent, DemoEventType};
    use std::path::Path;

    let demo_dir_path = Path::new("src/tests/data/demos");

    let demo_names = read_demos_in_directory(demo_dir_path).expect("Failed to read directory");

    // Out of the four directory entries with the `.dem` extension,
    // one is a directory and should be ignored.
    assert_eq!(demo_names.len(), 3);

    let demos = demo_names
        .iter()
        .filter_map(|demo_name| {
            let demo_path = demo_dir_path.join(demo_name).with_extension("dem");

            read_demo(&demo_path).ok()
        })
        .collect::<Vec<Demo>>();

    // Only one of the four entries in the directory is a valid demo.
    // The other entries should not end up in `demos`,
    // and they should only produce a warn message and no panic.
    // Note: The logger is not initialized in the test environment and thus no message is logged.
    assert_eq!(demos.len(), 1);

    let demo = &demos[0];

    assert_eq!(demo.name, "test_demo");
    assert_eq!(demo.filesize, 56_583_563);
    assert_eq!(demo.server_name, "kroket.fakkelbrigade.eu:27115".to_owned());
    assert_eq!(demo.client_name, "Narcha".to_owned());
    assert_eq!(demo.map_name, "cp_process_f5".to_owned());
    assert_eq!(demo.num_ticks, 182_206);
    assert_eq!(
        demo.events,
        vec![DemoEvent {
            name: DemoEventType::Bookmark,
            value: "New Bookmark".to_owned(),
            tick: 0,
        }]
    );
    assert_eq!(demo.tags, vec!["test"]);
}

#[test]
fn test_json_read_and_write() {
    use crate::demo::{read_events_and_tags, write_events_and_tags};
    use std::path::Path;

    let json_path_old = Path::new("src/tests/data/demos/test_demo.json");
    let json_path_new = Path::new("src/tests/data/demos/tmp_out.json");

    let (events, tags) = read_events_and_tags(json_path_old);
    write_events_and_tags(json_path_new, &events, &tags).expect("Writing JSON file failed");

    let old_file_content = std::fs::read(json_path_old).expect("Failed to read old file");
    let new_file_content = std::fs::read(json_path_new).expect("Failed to read new file");

    assert_eq!(old_file_content, new_file_content);

    std::fs::remove_file(json_path_new).unwrap();
}
